"""
Portable Configuration Module
Ensures database path works both in development and as .exe
"""
import sys
from pathlib import Path


def get_base_path() -> Path:
    """
    Returns the base directory path.
    Works both in development and when frozen as .exe
    
    Returns:
        Path: Base directory where the executable/script is located
    """
    if getattr(sys, 'frozen', False):
        # Running as compiled .exe (PyInstaller)
        # sys.executable points to the .exe file
        base_path = Path(sys.executable).parent
    else:
        # Running as normal Python script
        base_path = Path(__file__).parent
    
    return base_path


def get_db_path() -> Path:
    """
    Returns the SQLite database file path.
    Database will be in the same folder as the .exe
    
    Returns:
        Path: Full path to sismik.db
    """
    return get_base_path() / "sismik.db"


# Export for easy import
DB_PATH = get_db_path()
BASE_PATH = get_base_path()
