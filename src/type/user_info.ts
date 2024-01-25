export interface contest_info {
  contest_id: number;
  contest_name: string;
  handle: string;
  rank: number;
  rating_update_time_seconds: number;
  old_rating: number;
  new_rating: number;
}
export interface user_item {
  rating?: number;
  contest_info: contest_info[];
  problem_total?: number;
  name: string;
  grade: number;
  codeforces_handle: string;
}

export interface user_data {
  user_info: {[key:string]: user_item};
  update_time: string;
}
