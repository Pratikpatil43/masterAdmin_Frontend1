import AuthForm from './AuthForm';

const RegisterPage = () => {
    const handleRegister = (e) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Registration attempt');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-5 shadow rounded">
                <AuthForm type="register" onSubmit={handleRegister} />
            </div>
        </div>
    );
};

export default RegisterPage;
