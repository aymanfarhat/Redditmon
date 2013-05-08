# Clears content of all log files 

import os

dirname = "logs"

for filename in os.listdir(dirname):
	f = open(dirname+"/"+filename,'w')
	f.close()
