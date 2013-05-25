""" Module with validation functions """
import re 

def date(dt):
    """ Validates a Datetime string """
    if bool(re.search(r"^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$",dt)):     
        dt_lst = map(int,dt.split("-"))
        if (dt_lst[1] >= 1 and dt_lst[1] <= 12) and (dt_lst[2] >= 1 and dt_lst[2] <= 31):
            return True
        return False

def nonempty_list_vals(lst):
    """ Validates a list of strings for not containing empty or None values """
    return (None not in lst) and all(len(el.strip()) > 0 for el in lst)
    
