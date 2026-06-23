function Header({ title, subtitle, rightContent = null }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        ) : null}
      </div>

      {rightContent ? <div>{rightContent}</div> : null}
    </header>
  );
}

export default Header;