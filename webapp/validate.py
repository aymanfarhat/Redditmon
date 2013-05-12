""" Module with validation functions """
import re 

def date(dt):
	dt_lst = map(int,dt.split("-"))
	print dt_lst
	if (dt_lst[1] >= 1 and dt_lst[1] <= 12) and (dt_lst[2] >= 1 and dt_lst[2] <= 31):
		return bool(re.search(r"^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$",dt))	
	return False
