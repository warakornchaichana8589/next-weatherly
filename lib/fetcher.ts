import { getSession } from "next-auth/react";

export interface FetcherOptions extends RequestInit {
    useAuth?: boolean;
    signal?: AbortSignal;
}
export async function fetcher<T>(
    url: string,
    options: FetcherOptions = {}
): Promise<T> {
    const controller = new AbortController();
    const signal = options.signal || controller.signal;
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };
        if (options.useAuth) {
            const session = await getSession();
            if (session?.accessToken) {
                headers["Authorization"] = `Bearer ${session.accessToken}`;
            }
        }
        const response = await fetch(url, {
            ...options,
            headers,
            signal,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch failed (${response.status}): ${errorText}`);
        }
        const data = (await response.json()) as T;
        return data;
    } catch (error: any) {
        if (error.name === "AbortError") {
            console.warn("Fetch aborted:", url);
            throw new Error("Request was aborted");
        }

        console.error("Fetcher error:", error);
        throw error;
    }
}
