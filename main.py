from datetime import datetime

from spider.codeforces_spider import CodeforcesSpider
import json


def main():
    with open('data.json', 'r') as f:
        data = json.load(f)
    user_data = data.get('user_info', {})
    with open('user.json', 'r') as f:
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
            codeforces_spider = CodeforcesSpider()
            rating = codeforces_spider.get_user_rating(handle)
            if rating != 0:
                origin_user_info['rating'] = rating
            problem_total = codeforces_spider.get_problem_info(handle)
            if problem_total != 0:
                origin_user_info['problem_total'] = problem_total
            content_info = codeforces_spider.get_user_contest_info(handle)
            if len(content_info) != 0:
                origin_user_info['contest_info'] = content_info
            print(user_name, origin_user_info)
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
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


main()
