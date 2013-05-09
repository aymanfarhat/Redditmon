The worker module is deployed on a linux server simply by running redditmon.py as a background process via: nohup python reddit.py & which will keep it running till forever.

Every 10 minutes the script will fetch the data related to the subreddits included in subreddits.in and write to the respective file within the logs directory.

To stop the process look for its pid via "ps -Af|grep redditmon.py" and then "kill pid"
