import { Link, Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <Link
            to="/"
            className="text-xl font-bold tracking-tight"
          >
            ShopMesh
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link
              to="/search"
              className="transition hover:text-white"
            >
              Search
            </Link>

            <Link
              to="/compare"
              className="transition hover:text-white"
            >
              Compare
            </Link>
          </div>

        </nav>
      </header>

      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;