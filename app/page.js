import Image from "next/image";

export default function Home() {
	return (
		<div className="flex m-auto w-screen items-center justify-center h-screen">
			<Image alt="votomo" width={200} height={200} src="/img/votomo.png" />
		</div>
	);
}
