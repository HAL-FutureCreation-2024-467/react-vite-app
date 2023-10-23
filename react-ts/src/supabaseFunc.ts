import { supabase } from './supabaseClient'
import { Database } from './types/database'

export const TABLE_NAME = "sample";

// データの取得
export const fetchDatabase = async () => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("createdAt"); // 全てのテーブルデータを日付順でソート
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

// データの追加
export const addSupabaseData = async ({ id, text, isDone }: Database) => {
  try {
    await supabase.from(TABLE_NAME).insert({ id, text, isDone }); // 新しく行を追加
  } catch (error) {
    console.error(error);
  }
};

// データの削除
export const removeSupabaseData = async (taskId: number) => {
  try {
    await supabase.from(TABLE_NAME).delete().match({ id: taskId });  // 指定したIDの行を削除
  } catch (error) {
    console.error(error);
  }
};

// アップデート（チェックボックス）
export const updateSupabaseData = async (taskId: number, newStatus: boolean) => {
  try {
    await supabase.from(TABLE_NAME).update({ isDone: newStatus }).match({ id: taskId }); // 指定したIDのチェック状態を更新
  } catch (error) {
    console.error(error);
  }
};