#!/usr/bin/env python3
"""
Simple script to start the FastAPI server
"""
import uvicorn
import os

if __name__ == "__main__":
    # Set the current directory to the script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start the server
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True
    )