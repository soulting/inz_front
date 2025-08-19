import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export function handleApiError(error, router) {
  const authStore = useAuthStore()

  const showError = (title, text) => {
    Swal.fire({ icon: 'error', title, text })
  }

  if (error.response) {
    const { status, data } = error.response
    const message = data?.error || 'Wystąpił nieoczekiwany błąd.'

    switch (status) {
      case 400:
        showError('Błąd', message)
        break
      case 401:
        Swal.fire({
          icon: 'error',
          title: 'Sesja wygasła',
          text: 'Zaloguj się ponownie.',
        }).then(() => {
          authStore.piniaLogout()
          router.push('/login')
        })
        break
      case 403:
        showError('Brak dostępu', 'Nie masz uprawnień do wykonania tej akcji.')
        break
      case 404:
        showError('Nie znaleziono', message)
        break
      default:
        showError('Błąd', message)
        break
    }
  } else if (error.request) {
    console.error('Brak odpowiedzi od serwera:', error.request)
    showError('Brak odpowiedzi', 'Serwer nie odpowiada.')
  } else {
    console.error('Błąd Axios:', error.message)
    showError('Błąd', 'Wystąpił problem z zapytaniem.')
  }
}
