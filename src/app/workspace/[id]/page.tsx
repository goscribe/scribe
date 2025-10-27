"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const params = useParams();
    const workspaceId = params.id as string;
    
    useEffect(() => {
        router.push(`/workspace/${workspaceId}/study-guide`);
    }, [router, workspaceId]);
    
    return <span>loading...</span>;
}   