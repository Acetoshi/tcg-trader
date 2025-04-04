import re


def sanitize_input(input_string):
    """
    Sanitizes any string input by removing characters that are
    not alphanumeric or spaces.
    """
    if not input_string:
        return input_string  # Return empty input as is

    # Remove anything that is not a letter, number, or space
    return re.sub(r"[^a-zA-Z0-9\s-]", "", input_string)
