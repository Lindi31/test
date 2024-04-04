import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <div className="flex items-center">
        <Image
          src="/img/CDLogo-small.svg"
          alt="logo"
          height={50}
          width={70}
          priority
        />
        <h1 className="text-2xl font-bold ml-3">
          {" "}
          {/* Added margin-left for spacing */}
          <span className="text-gray-900 dark:text-gray-200">Cable</span>
          <span className="text-emerald-800">Doc</span>
        </h1>
      </div>
    </LinkStyled>
  );
};

export default Logo;
