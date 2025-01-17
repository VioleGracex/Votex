import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const socialLinks = [
  {
    href: "https://linkedin.com/in/your-profile",
    label: "LinkedIn",
    icon: <FaLinkedin />,
  },
  {
    href: "https://github.com/your-profile",
    label: "GitHub",
    icon: <FaGithub />,
  },
  {
    href: "https://twitter.com/your-profile",
    label: "Twitter",
    icon: <FaTwitter />,
  },
  {
    href: "mailto:your-email@example.com",
    label: "Email",
    icon: <FaEnvelope />,
  },
];

const Social = () => {
  const iconStyles =
    "w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-blue-500 hover:text-white transition-all duration-500";

  return (
    <div className="flex flex-row justify-center gap-4">
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          passHref
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={iconStyles}
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
};

export default Social;
