import Image from 'next/image'

export default function VisualLogin() {
  return (
    <div className="login-visual">
      <Image
        src="/logo.png"
        alt="Logo Marka Ch'uxña"
        width={250}
        height={250}
        className="login-logo"
        priority
      />
      <div className="visual-text">
        <h2>Panel de Trabajadores</h2>
        <p>Bienvenido al sistema de gestión de Marka Chuxña Multiservicios.</p>
      </div>
    </div>
  )
}