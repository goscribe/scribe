"use client";

import { useParams, useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const params = useParams();
    const workspaceId = params.id as string;
    router.push(`/workspace/${workspaceId}/study-guide`);
    return <span>loading...</span>;
}   