import { useMutation } from '@tanstack/react-query'
import Alert from 'react-s-alert'
import { useNavigate, useRouteLoaderData } from 'react-router'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { MAP, SIGN_IN } from '../../routes'
import { signOutUser } from '../../queries/users.api'
import { RootLoaderData } from '../../root'
import config from '../../configuration.ts'
import EntriesNavigation from './EntriesNavigation'
import AccountNavigation from './AccountNavigation'

const HelpExternal = () => {
  const { t } = useTranslation()
  return (
    <a
      className='button button-help'
      href={config.externalHelpUrl}
      target='_blank'
      rel='noopener noreferrer'
    >
      {t('nav.help')}
    </a>
  )
}

interface LoggedInNavigationProps {
  username: string
  onSignOutClick: () => void
}

const LoggedInNavigation = ({
  username,
  onSignOutClick
}: LoggedInNavigationProps) => (
  <div className='user-nav'>
    <ul>
      <li>
        <EntriesNavigation />
      </li>
      <li>
        <AccountNavigation
          username={username}
          onSignOutClick={onSignOutClick}
        />
      </li>
      {config.externalHelpUrl && (
        <li>
          <HelpExternal />
        </li>
      )}
    </ul>
  </div>
)

const LoggedOutNavigation = () => {
  const { t } = useTranslation()
  return (
    <div className='user-nav'>
      <ul>
        <li>
          <Link className='account-nav-login' to={SIGN_IN}>
            {t('nav.edit_entries')}
          </Link>
        </li>
        {config.externalHelpUrl && (
          <li>
            <HelpExternal />
          </li>
        )}
      </ul>
    </div>
  )
}

const Navigation = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useRouteLoaderData('root') as RootLoaderData

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await signOutUser()
      Alert.success(t('user.onboarding.sign_out_success'))
      navigate(MAP)
      return response
    },
    meta: {
      errorMessage: t('errors.sign_out_failed_long_text')
    }
  })

  const handleSignOutClick = () => {
    signOutMutation.mutate()
  }

  return (
    <nav>
      {user ? (
        <LoggedInNavigation
          username={user.name}
          onSignOutClick={handleSignOutClick}
        />
      ) : (
        <LoggedOutNavigation />
      )}
    </nav>
  )
}

export default Navigation
