""" Module with validation functions """
import re 

def date(dt):
	if bool(re.search(r"^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$",dt)):		
		dt_lst = map(int,dt.split("-"))
		if (dt_lst[1] >= 1 and dt_lst[1] <= 12) and (dt_lst[2] >= 1 and dt_lst[2] <= 31):
			return True
		return False
