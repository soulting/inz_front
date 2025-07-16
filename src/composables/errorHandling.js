import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

export function handleApiError(error, router) {
  const authStore = useAuthStore()

  const showError = (title, text) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
    })
  }

  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 400:
        showError('Błąd', data?.error || 'Błędne dane.')
        break

      case 401:
        showError('Sesja wygasła', 'Zaloguj się ponownie.').then(() => {
          authStore.piniaLogout()
          router.push('/login')
        })
        break

      case 403:
        showError('Brak dostępu', 'Nie masz uprawnień do wykonania tej akcji.')
        break

      case 404:
        showError('Nie znaleziono', data?.error || 'Zasób nie istnieje.')
        break

      default:
        showError('Błąd', data?.error || 'Wystąpił nieoczekiwany błąd.')
    }
  } else if (error.request) {
    console.error('Brak odpowiedzi od serwera:', error.request)
    showError('Brak odpowiedzi', 'Serwer nie odpowiada.')
  } else {
    console.error('Błąd Axios:', error.message)
    showError('Błąd', 'Wystąpił problem z zapytaniem.')
  }
}
