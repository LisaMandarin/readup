"""
Translation Service - Enhanced translation saving and management
Working with Tigbo integration requirements
"""
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, DataError

from models import Passage, Session as SessionModel
from schemas import PassageCreateRequest, PassageUpdateRequest

# Set up logging for translation operations
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TranslationSaveError(Exception):
    """Custom exception for translation saving errors"""
    pass


class TranslationService:
    """Service for managing translation saving and persistence"""
    
    @staticmethod
    def validate_translation_data(sentence: str, translation: Optional[str]) -> Dict[str, Any]:
        """Validate and clean translation data before saving"""
        result = {
            "is_valid": True,
            "errors": [],
            "cleaned_sentence": sentence.strip(),
            "cleaned_translation": None
        }
        
        # Validate sentence
        if not sentence or not sentence.strip():
            result["is_valid"] = False
            result["errors"].append("Sentence cannot be empty")
            
        # Validate and clean translation if provided
        if translation:
            cleaned_translation = translation.strip()
            if cleaned_translation:
                result["cleaned_translation"] = cleaned_translation
            
            # Check for potentially problematic characters or patterns
            if len(cleaned_translation) > 10000:  # Reasonable limit
                result["is_valid"] = False
                result["errors"].append("Translation too long (max 10,000 characters)")
                
        return result
    
    @staticmethod
    def save_translation(
        db: Session,
        session_id: int,
        sentence: str,
        translation: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Passage:
        """
        Safely save a translation with enhanced error handling and validation
        """
        try:
            # Validate input data
            validation = TranslationService.validate_translation_data(sentence, translation)
            if not validation["is_valid"]:
                raise TranslationSaveError(f"Validation errors: {', '.join(validation['errors'])}")
            
            # Verify session exists and user has permission (if user_id provided)
            session_query = db.query(SessionModel).filter(SessionModel.id == session_id)
            if user_id:
                session_query = session_query.filter(SessionModel.user_id == user_id)
                
            session = session_query.first()
            if not session:
                raise TranslationSaveError(f"Session {session_id} not found or access denied")
            
            # Create new passage with translation
            new_passage = Passage(
                session_id=session_id,
                sentence=validation["cleaned_sentence"],
                translation=validation["cleaned_translation"]
            )
            
            db.add(new_passage)
            db.flush()  # Get the ID without committing yet
            
            # Log the translation save operation
            logger.info(f"Saving translation for passage {new_passage.id} in session {session_id}")
            if translation:
                logger.info(f"Translation provided: {len(translation)} characters")
            
            # Update session's updated_at timestamp
            session.updated_at = datetime.now(timezone.utc)
            
            db.commit()
            db.refresh(new_passage)
            
            logger.info(f"Successfully saved passage {new_passage.id} with translation")
            return new_passage
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error saving translation: {str(e)}")
            raise TranslationSaveError(f"Database error: {str(e)}")
        
        except DataError as e:
            db.rollback()
            logger.error(f"Data error saving translation: {str(e)}")
            raise TranslationSaveError(f"Invalid data: {str(e)}")
        
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error saving translation: {str(e)}")
            raise TranslationSaveError(f"Failed to save translation: {str(e)}")
    
    @staticmethod
    def update_translation(
        db: Session,
        passage_id: int,
        session_id: int,
        sentence: Optional[str] = None,
        translation: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Passage:
        """
        Safely update an existing translation with validation and logging
        """
        try:
            # Find the passage
            passage_query = db.query(Passage).filter(
                Passage.id == passage_id,
                Passage.session_id == session_id
            )
            
            # Add user permission check if user_id provided
            if user_id:
                passage_query = passage_query.join(SessionModel).filter(
                    SessionModel.user_id == user_id
                )
            
            passage = passage_query.first()
            if not passage:
                raise TranslationSaveError(f"Passage {passage_id} not found or access denied")
            
            # Track what's being updated
            updates = []
            
            # Update sentence if provided
            if sentence is not None:
                validation = TranslationService.validate_translation_data(sentence, None)
                if not validation["is_valid"]:
                    raise TranslationSaveError(f"Sentence validation errors: {', '.join(validation['errors'])}")
                
                old_sentence = passage.sentence
                passage.sentence = validation["cleaned_sentence"]
                updates.append(f"sentence updated (was: {len(old_sentence)} chars)")
            
            # Update translation if provided
            if translation is not None:
                validation = TranslationService.validate_translation_data(passage.sentence, translation)
                if not validation["is_valid"]:
                    raise TranslationSaveError(f"Translation validation errors: {', '.join(validation['errors'])}")
                
                old_translation_len = len(passage.translation) if passage.translation else 0
                passage.translation = validation["cleaned_translation"]
                new_translation_len = len(passage.translation) if passage.translation else 0
                updates.append(f"translation updated ({old_translation_len} -> {new_translation_len} chars)")
            
            if updates:
                # Update the session's timestamp
                session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
                if session:
                    session.updated_at = datetime.now(timezone.utc)
                
                logger.info(f"Updating passage {passage_id}: {', '.join(updates)}")
                
                db.commit()
                db.refresh(passage)
                
                logger.info(f"Successfully updated passage {passage_id}")
            
            return passage
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error updating translation: {str(e)}")
            raise TranslationSaveError(f"Database error: {str(e)}")
        
        except DataError as e:
            db.rollback()
            logger.error(f"Data error updating translation: {str(e)}")
            raise TranslationSaveError(f"Invalid data: {str(e)}")
        
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error updating translation: {str(e)}")
            raise TranslationSaveError(f"Failed to update translation: {str(e)}")
    
    @staticmethod
    def batch_save_translations(
        db: Session,
        session_id: int,
        passages_data: List[Dict[str, str]],
        user_id: Optional[int] = None
    ) -> List[Passage]:
        """
        Save multiple translations in a single transaction
        Format: [{"sentence": "text", "translation": "text"}, ...]
        """
        try:
            # Verify session exists
            session_query = db.query(SessionModel).filter(SessionModel.id == session_id)
            if user_id:
                session_query = session_query.filter(SessionModel.user_id == user_id)
                
            session = session_query.first()
            if not session:
                raise TranslationSaveError(f"Session {session_id} not found or access denied")
            
            saved_passages = []
            
            for i, passage_data in enumerate(passages_data):
                sentence = passage_data.get("sentence", "").strip()
                translation = passage_data.get("translation", "").strip() or None
                
                # Validate each passage
                validation = TranslationService.validate_translation_data(sentence, translation)
                if not validation["is_valid"]:
                    raise TranslationSaveError(f"Batch item {i+1} validation errors: {', '.join(validation['errors'])}")
                
                # Create passage
                new_passage = Passage(
                    session_id=session_id,
                    sentence=validation["cleaned_sentence"],
                    translation=validation["cleaned_translation"]
                )
                db.add(new_passage)
                saved_passages.append(new_passage)
            
            # Update session timestamp
            session.updated_at = datetime.now(timezone.utc)
            
            # Commit all at once
            db.commit()
            
            # Refresh all passages
            for passage in saved_passages:
                db.refresh(passage)
            
            logger.info(f"Successfully batch saved {len(saved_passages)} passages to session {session_id}")
            return saved_passages
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error in batch save translations: {str(e)}")
            raise TranslationSaveError(f"Batch save failed: {str(e)}")
    
    @staticmethod
    def get_translation_statistics(db: Session, session_id: int) -> Dict[str, Any]:
        """
        Get statistics about translations in a session
        """
        try:
            passages = db.query(Passage).filter(Passage.session_id == session_id).all()
            
            total_passages = len(passages)
            with_translations = len([p for p in passages if p.translation])
            without_translations = total_passages - with_translations
            
            avg_sentence_length = sum(len(p.sentence) for p in passages) / total_passages if total_passages > 0 else 0
            avg_translation_length = sum(len(p.translation or "") for p in passages if p.translation) / with_translations if with_translations > 0 else 0
            
            return {
                "total_passages": total_passages,
                "with_translations": with_translations,
                "without_translations": without_translations,
                "translation_completion_rate": (with_translations / total_passages * 100) if total_passages > 0 else 0,
                "avg_sentence_length": round(avg_sentence_length, 1),
                "avg_translation_length": round(avg_translation_length, 1)
            }
            
        except Exception as e:
            logger.error(f"Error getting translation statistics: {str(e)}")
            return {"error": str(e)}