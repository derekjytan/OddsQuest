from .helpers import validate_email

# You can add more utility imports or package-level configurations here
# For example:
def get_logger():
    """
    Example of a utility function that could be imported package-wide
    """
    import logging
    logging.basicConfig(level=logging.INFO, 
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    return logging.getLogger(__name__)