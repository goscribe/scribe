import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getUserInitials = (name: string) => {
    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function ProfilePicture ({
    id,
    name
}: {
    id: string;
    name: string;
}) {
    const objectKey = `profile_picture_${id}`;

    return <Avatar className="h-8 w-8">
    <AvatarImage src={`${process.env.NEXT_PUBLIC_BACKEND_URL}profile-picture/${objectKey}`} alt={name}    crossOrigin="anonymous"
    />
    <AvatarFallback className="text-sm flex items-center justify-center">
      {getUserInitials(name)}
    </AvatarFallback>
  </Avatar>
}