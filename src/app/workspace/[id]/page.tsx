import {Metadata} from "next";

type MDProps ={
    params: {
        id: string;
    };
}

export const generateMetadata = ({ params }: MDProps): Metadata => {
    return {
        title: `Workspace ${params.id} - Scribe`,
    };
}

export default function Home() {
    return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}