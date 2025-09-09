const UserAvatar = ({ avatar, name, size = 35 }) => {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.5}px`,
    fontWeight: "bold",
  };

  return avatar ? (
    <img
      src={avatar}
      alt={name || "User"}
      className="rounded-circle"
      width={size}
      height={size}
    />
  ) : (
    <div
      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
      style={avatarStyle}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
