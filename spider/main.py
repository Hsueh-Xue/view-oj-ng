import time
from datetime import datetime

import json
import re

from spider.codeforces_spider import get_user_rating, get_user_contest_info, get_problem_info


def to_snake_case(camel_str):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', camel_str)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def convert_keys_to_snake_case(data):
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            new_key = to_snake_case(key)
            new_value = convert_keys_to_snake_case(value)
            new_data[new_key] = new_value
        return new_data
    elif isinstance(data, list):
        return [convert_keys_to_snake_case(item) for item in data]
    else:
        return data


def main():
    with open('/public/data.json', 'r') as f:
        data = json.load(f)
    user_data = data.get('user_info', {})
    with open('user.json', 'r') as f:
        time.sleep(0.5)
        user_info = json.load(f)
        user_map = {}
        for user in user_info:
            user_name = user.get('name', '')
            handle = user.get('codeforces_handle', '')
            user_map[user_name] = user
            origin_user_info = user_data.get(user_name, {})
            origin_user_info['name'] = user_name
            origin_user_info['grade'] = user.get('grade', 0)
            origin_user_info['codeforces_handle'] = handle
            rating = get_user_rating(handle)
            if rating != 0:
                origin_user_info['rating'] = rating
            problem_total = get_problem_info(handle)
            if problem_total != 0:
                origin_user_info['problem_total'] = problem_total
            content_info = get_user_contest_info(handle)
            if len(content_info) != 0:
                origin_user_info['contest_info'] = content_info
                origin_user_info['contest_total'] = len(content_info)
            user_data[user_name] = origin_user_info
        user_to_remove = []
        for user_name in user_data:
            if user_name not in user_map:
                user_to_remove.append(user_name)
        print(user_to_remove)
        for user_name in user_to_remove:
            del user_data[user_name]
    data['user_info'] = user_data
    current_time = datetime.now()
    formatted_time = current_time.strftime('%Y-%m-%d %H:%M:%S')
    data['update_time'] = formatted_time
    data = convert_keys_to_snake_case(data)
    with open('/public/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


main()
