import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

const Login = () => {
    return (
        <div>
            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#4F46E5',
                                brandAccent: '#4338CA',
                            },
                            borderWidths: {
                                buttonBorderWidth: '1px',
                                inputBorderWidth: '1px',
                            },
                            radii: {
                                borderRadiusButton: '8px',
                                inputBorderRadius: '8px',
                            },
                        }
                    }
                }}
                providers={[]}
            />
        </div>
        
    )
}

export default Login