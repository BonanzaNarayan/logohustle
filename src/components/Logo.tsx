import Image from "next/image"

export const Logo = () => {
    return (
      <Image height={35} width={35} src="/logo.svg" alt="LogoHustle" className="rounded-lg" />
    )
};