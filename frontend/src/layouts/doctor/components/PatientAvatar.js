import PropTypes from "prop-types";

function initialsFromName(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function PatientAvatar({ name, imageUrl, size = "md" }) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-24 w-24 text-2xl",
    xl: "h-32 w-32 text-3xl",
  };

  const src =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=2563eb&color=fff&bold=true`;

  return (
    <img
      src={src}
      alt={name || "Avatar"}
      className={`${
        sizeClasses[size] || sizeClasses.md
      } shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          initialsFromName(name)
        )}&background=e2e8f0&color=475569&bold=true`;
      }}
    />
  );
}

PatientAvatar.propTypes = {
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};
