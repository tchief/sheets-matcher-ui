import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
export const supabaseClientAnonKey = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const slice = (obj: any, exclude: string[]) => {
    const sliced = Object.assign({}, obj);
    for (let prop of Object.keys(obj).filter(key => !exclude.includes(key))) {
        delete (sliced as any)[prop];
    }
    return sliced;
};

export const useRealtimeRows = <T extends { id: any }>(
    table: string,
    column: keyof T, // This column should not be changed over time, otherwise realtime updates would be missed.
    value: any,
    columns: string[],
    filter: (t: T) => boolean = (_) => true,
    supa = supabaseClientAnonKey) => {
    const [rows, setRows] = useState<T[]>([]);

    const far = (t: any) => filter(t) ? [t] : [];
    const farr = (t: any[]) => t.flatMap(far);

    const handleInsert = (payload: SupabaseRealtimePayload<any>) => setRows((prev) => [...prev, ...far(slice(payload.new, columns))]);
    const handleDelete = (payload: SupabaseRealtimePayload<any>) => setRows((prev) => prev.filter((i) => i.id !== payload?.old?.id));
    const handleUpdate = (payload: SupabaseRealtimePayload<any>) => {
        console.log({ p: payload, new: payload.new, f: far(slice(payload.new, columns)) })
        setRows((prev) => [...prev.filter((i) => i.id !== payload?.old?.id), ...far(slice(payload.new, columns))]);
    }

    useEffect(() => {
        supa.from<T>(`${table}`)
            .select(columns.join(','))
            .eq(column, value)
            .then(({ data }) => setRows([...farr(data ?? [])]));
    }, [])

    useEffect(() => {
        const subscription = supa
            // TODO: BUG: Be aware, if column:value changed to smth else, this row would not come in realtime.
            // VS if row deleted, it comes as .old, but if it was filtered in .from -> it wouldn't.
            // Ensure column is not changed over time.
            .from<T>(`${table}:${column}=eq.${value}`)
            .on('INSERT', handleInsert)
            .on('DELETE', handleDelete)
            .on('UPDATE', handleUpdate)
            .subscribe();

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return [rows];
}