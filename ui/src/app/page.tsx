import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="table">
      <h1>Bienvenido a Deeployable</h1>
      <p>Administra despliegues de un proyecto en un panel sencillo.</p>
      <p>
        <Link href="/setup">Configurar</Link> · <Link href="/(auth)/login">Iniciar sesión</Link>
      </p>
    </section>
  );
}
