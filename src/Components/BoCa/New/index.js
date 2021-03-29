import React, {useState, useRef} from 'react';
import axios from 'axios';
// import { Redirect} from 'react-router-dom';


const NewBoCa = () => {
    const [email, setEmail] = useState(null);
    const [language, setLanguage] = useState('en');
    const [bocaId, setBocaId] = useState(null);

    React.useEffect(() => {
        // function handleResize() {
        //     // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        //     // iframeRef.current.style =  `height: ${window.innerHeight}px, width: '1px', minWidth: '100%'`;
        //     // iframeRef.current.size(window.innerHeight);
        // }
        // window.addEventListener('resize', handleResize)
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {email, locale} = e.target.elements;
        try {
            setEmail(email.value);
            // console.log(`ENDPOINT: ${process.env.REACT_APP_API_ENDPOINT}/trials/tests`);

            // these are the form elements for demographics... if you want to pass them at some point in data {} below
            // do not keep the nested structure, just the keys. the example is from the server endpoint to show how it handles it
            // the idea is to cache some of these values in the future an only ask for what might have changes since the last time
            //they took the test
            // const demographics = {
            //     gender: req.body.gender,
            //     age: parseInt(req.body.age),
            //     yob: parseInt(req.body.yob),
            //     education: req.body.education,
            //     diagnostics: {
            //         alzheimers: req.body['diag-alzheimers'] === 'on',
            //         mid_cognitive: req.body['diag-mid-cognitive'] === 'on',
            //         fronto_temporal_dementia: req.body['diag-front'] === 'on',
            //         vascular: req.body['diag-vasc'] === 'on',
            //         parkinson: req.body['diag-mid-cognitive'] === 'on',
            //         multiple_sclerosis: req.body['diag-multiple-sc'] === 'on',
            //         traumatic_brain_injury: req.body['traumatic-brain'] === 'on',
            //         other: req.body['diag-other-text'] || null,
            //     },
            //     therapy: {
            //         daily_pa_mins: parseInt(req.body['therapy-pa-mins']) || null,
            //         daily_light_mins: parseInt(req.body['therapy-light-mins']) || null,
            //         daily_brain_games_mins: parseInt(req.body['therapy-brain-mins']) || null,
            //         daily_socializing_mins: parseInt(req.body['therapy-social-mins']) || null,
            //         daily_reading_mins: parseInt(req.body['therapy-reading-mins']) || null,
            //         cognitive_drugs: req.body['therapy-cognitive-drugs-text'] || null,
            //         other_drugs: req.body['therapy-other-drugs-text'] || null,
            //     },
            // };
            const response = await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_ENDPOINT}/trials/tests`,
                data: {
                    reportType: 'boca',
                    trialCode: 'XYAFG',
                    email: email.value,
                    locale: locale.value,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    originator: 'pwa', //TODO parameterize,
                    notifyParticipant: 'false',
                    notifyAdmins: 'false',
                    consent: "I agree.",
                }
            });
            setBocaId(response.data.bocaId);
        } catch (error) {
            alert(error);
        }
    };

    const onLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    if (!bocaId) {
    // if (false) {
        return (
            <div style={{margin: '20px'}}>
                <h1>Boston Cognitive Assessment (BoCA)</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Email" value={email||''} onChange={(e)=>setEmail(e.target.value)}/>
                    <div>
                        <label htmlFor="locale">Language</label>
                        <select id="locale" name="locale" required value={language} onChange={onLanguageChange}>
                            <option  value="en">English</option>
                            <option value="ru">Русский</option>
                            <option value="es">Español</option>
                            <option value="cn">中文</option>
                        </select>
                    </div>
                    <button type="submit">Start Test</button>
                </form>
                <hr/>
            </div>
        );
    } else {

        return (<div style={{margin: '20px'}}><h1>Boston Cognitive Assessment (BoCA)</h1>
            <button onClick={() => {
                setBocaId(null);
            }}>New Test
            </button>
            <div style={{margin: '20px 0', height: '800px'}}>
                <iframe
                    title="BoCa"
                    frameBorder="0"
                    scrolling="no"
                    src={`/boca/survey.html?id=${bocaId}&bu=${process.env.REACT_APP_API_ENDPOINT}`}
                    style={{ width: '100%', height: `800px` }}
                />
            </div>
        </div>);
    }
};

export default NewBoCa;