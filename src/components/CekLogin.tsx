const CekLogin = () => {
    if (localStorage.getItem('role') != null &&
        (
            (localStorage.getItem('role') == 'lisDo') ||
            (localStorage.getItem('role') == 'lisAd') ||
            (localStorage.getItem('role') == 'lisPa')
        )
    ) {
        // window.location.href = '/';
    } else {
        window.location.href = '/login';
    }
}

export default CekLogin;