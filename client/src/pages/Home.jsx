function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col items-center justify-center px-6 text-center">

      <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        AI-powered shopping
      </p>

      <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
        One search.
        <br />
        Every store.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Describe what you're looking for and ShopMesh
        will help you find the best products across
        multiple stores.
      </p>

    </section>
  );
}

export default Home;