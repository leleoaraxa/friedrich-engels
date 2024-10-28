import { Link } from 'react-router-dom'

import chartHistogramIcon from '../assets/icons/chart-histogram.svg'
import packageIcon from '../assets/icons/package.svg'
import plusSignIcon from '../assets/icons/plus-sign.svg'
import logoImage from '../assets/images/logo.svg'
import { AccountMenu } from './accountMenu'
import { CustomNavLink } from './customNavLink'

export function Header() {
  return (
    <div className="flex h-20 items-center justify-between border-b border-[var(--shape)]">
      <div className=" p-5">
        <img src={logoImage} className="h-10 w-14" alt="Logo" />
      </div>

      <nav className="flex gap-2">
        <CustomNavLink to="/">
          <img
            src={chartHistogramIcon}
            className="h-5 w-5"
            alt="Ícone de gráfico"
          />
          Dashboard
        </CustomNavLink>

        <CustomNavLink to="/products">
          <img src={packageIcon} className="h-5 w-5" alt="Ícone de pacote" />
          Produtos
        </CustomNavLink>
      </nav>

      <div className="flex items-center gap-4 pr-5">
        <Link to="/products/add">
          <button className="flex h-10 w-full items-center justify-between gap-2 rounded-[.625rem] bg-[var(--orange-base)] px-4 text-[var(--white)] transition-colors duration-200 hover:bg-[var(--orange-dark)]">
            <img
              src={plusSignIcon}
              className="h-5 w-5"
              alt="Sinal matemático de adição"
            />
            <span className="action-sm">Novo produto</span>
          </button>
        </Link>

        <AccountMenu />
      </div>
    </div>
  )
}
