import json
import time
import requests
from requests import RequestException


def get_with_retry(url, max_retry=3):
    retries = 0
    while retries < max_retry:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()
        except RequestException as e:
            print(f"Request failed: {e}")
        retries += 1
        time.sleep(1)
    return None


def get_user_contest_info(username):
    url = 'http://codeforces.com/api/user.rating?handle={}'.format(username)
    res = get_with_retry(url)
    if res:
        if res["status"] != "OK":
            return {"success": False, "last_time": 0, 'contest_cnt': 0}
        return res['result']
    return {}


def get_user_rating(username):
    url = 'http://codeforces.com/api/user.info?handles={}'.format(username)
    rating = 0
    res = get_with_retry(url)
    if res:
        if res['status'] == "OK":
            rating = res['result'][0]['rating']
    return rating


def get_problem_info(oj_username):
    username = oj_username
    accept_problem_list = []
    url = 'http://codeforces.com/api/user.status?handle={}'.format(username)
    res = get_with_retry(url)
    if res:
        if res['status'] != 'OK':
            return []
        res = res['result']
        for rec in res:
            if rec['testset'] == 'PRETESTS':
                continue
            if rec.get('verdict') == 'OK':
                if rec['problem'].get('problemsetName'):
                    problem_pid = rec['problem']['index']
                else:
                    problem_pid = '{}{}'.format(rec['problem']['contestId'], rec['problem']['index'])
                accept_problem_list.append({
                    'oj': 'codeforces',
                    'problem_pid': problem_pid,
                })
    return len(accept_problem_list)
