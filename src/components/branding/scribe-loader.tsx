import { Loader2 } from "lucide-react";
import Image from "next/image";

export const ScribeLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-2">
                <Image src="/logo.png" alt="Scribe Logo" width={50} height={50} />
                <Loader2 className="animate-spin h-6 w-6 text-secondary" />
            </div>
        </div>
    );
};