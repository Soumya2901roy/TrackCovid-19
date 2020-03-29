const shareBtn = document.getElementById("shareBtn")

// check if web share API available if not display:none the share btn
if (!navigator.share) {


    shareBtn.classList.add('invisible')

} else {
    shareBtn.addEventListener('click', () => {
        navigator.share({
            title: 'COVID-19 Live Updates',
            text: 'Get COVID-19 live updates of Indian states ',
            url: 'http://gocoronago.netlify.com/'
        }).then(() => {

        }).catch(() => {

        })
    })
}