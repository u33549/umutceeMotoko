import { useState, useEffect, useRef } from 'react';
import { AnoSurvey_backend } from 'declarations/AnoSurvey_backend';
import AnimatedAlert from "./AnimatedAlert";



import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';  // Grid2 yerine Grid
import { blue } from '@mui/material/colors';
import { Paper, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import { makeStyles } from '@mui/styles';


import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


function App() {
  const [surveys, setSurvey] = useState([]);
  const [isCreatePopUpOpened, setCPUO] = useState(false);
  const [alertProps, setAlertProps] = useState({ severity: "", text: "", trigger: false });
  const [isVotePopUpOpened, setVPUO] = useState(false);
  const [selectedSurvey, setSS] = useState({
    question: "",
    results: [
      [
        "",
        0
      ],
      [
        "",
        0
      ]
    ],
    options: [
      "",
      ""
    ]
  })
  const [voterId, setVoterId] = useState(null);
  const [votedPolls, setVotedPolls] = useState([]);




  function fetchSurveys() {
    AnoSurvey_backend.getAllPollsCount().then((data) => {
      let surveysC = parseInt(data);
      if (surveysC == 0) {
        const result = confirm("Projeyi --clean etiketini kullanarak yeni mi başlattınız?");
        if (result) {
          localStorage.clear();
          const currentTime = Date.now();
          const randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
          const storedVoterId = `A${currentTime}${randomFiveDigitNumber}`;
          localStorage.setItem("voterId", String(storedVoterId));
          localStorage.setItem("votedPolls", "[]");

        }
      }
      let newSurveys = new Array(surveysC);

      let promises = [];

      for (let i = 0; i < surveysC; i++) {
        promises.push(
          AnoSurvey_backend.getPollResults(i).then((data) => {
            try {
              newSurveys[i] = data[0];
              newSurveys[i].id = i;
              for (var j = 0; j < newSurveys[i].results.length; j++) {
                newSurveys[i].results[j][1] = parseInt(newSurveys[i].results[j][1]);
              }
            }
            catch { }

          })
        );
      }

      Promise.all(promises).then(() => {
        setSurvey(newSurveys);
      });
    });
  }


  const showAlert = (severity, text) => {
    setAlertProps({ severity, text, trigger: true });
    setTimeout(() => {
      setAlertProps({ ...alertProps, trigger: false });
    }, 3000);
  };


  useEffect(() => {

    let storedVoterId = localStorage.getItem("voterId");
    if (!storedVoterId) {
      const currentTime = Date.now();
      const randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
      storedVoterId = `A${currentTime}${randomFiveDigitNumber}`;
      localStorage.setItem("voterId", String(storedVoterId));
    }
    let storedVotedPolls = localStorage.getItem("votedPolls");
    if (!storedVotedPolls) {
      localStorage.setItem("votedPolls", "[]");

    }
    setVoterId(storedVoterId);
    setVotedPolls(JSON.parse(storedVotedPolls))
    fetchSurveys();


  }, []);





  return (
    <Box sx={{ width: "100vw", minHeight: "100vh" }}>

      <AnimatedAlert severity={alertProps.severity} text={alertProps.text} trigger={alertProps.trigger} />

      <Stack sx={{ width: "94%", padding: "1.5vh 3vw", justifyContent: "space-between", alignItems: "center", backgroundColor: blue[500] }} direction="row" spacing={2}>
        <Typography sx={{ fontSize: "2rem", color: "#fff" }}>ANOSURVEY</Typography>
        <Button onClick={() => { setCPUO(true) }} sx={{ backgroundColor: "#fff", color: blue[700], fontSize: "1.2rem" }} variant="contained" endIcon={<AddIcon />} size="large">
          Anket Oluştur
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ width: "100%", marginTop: "1rem", padding: "0vh 2vw" }}>
        {surveys && surveys.map((data, id) => {
          if (!data) {
            return;
          }
          return (
            <Survey key={id} title={data.question} allDatas={data} setVPUOFunc={setVPUO} selectedSurveyFunc={setSS} />

          );
        })}
      </Grid>

      {isCreatePopUpOpened && <CreateSurveyPopUp fetchFunc={fetchSurveys} setCPUOFunc={setCPUO} showAlertFunc={showAlert}></CreateSurveyPopUp>}
      {true && isVotePopUpOpened && <VoteSurveyPopUp voterId={voterId} setVPUOFunc={setVPUO} fetchFunc={fetchSurveys} survey={selectedSurvey} showAlertFunc={showAlert} votedPolls={votedPolls} setVotedPolls={setVotedPolls}></VoteSurveyPopUp>}
    </Box>
  );
}

function Survey(props) {
  let sortedResult = [...props.allDatas.results].sort((a, b) => b[1] - a[1]);
  let voteSum = sortedResult.reduce((sum, item) => sum + item[1], 0);
  let infoText = voteSum ? `En populer cevap toplam ${voteSum} oy içinden ${sortedResult[0][1]} oy ile "${sortedResult[0][0]}"!` : "Henüz kimse oy vermedi ilk oy veren sen ol!!"


  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Başlık ve buton arasında boşluk sağlamak için
        minHeight: "240px", // Minimum yükseklik veriyoruz
        padding: "1vh 1%",
        elevation: 0,
        boxShadow: 5,
      }}>
        <CardContent >
          <Stack spacing={1}>

            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {infoText}
            </Typography>
          </Stack>

        </CardContent>
        <CardActions>
          <Button variant="contained" endIcon={<HowToVoteIcon />} onClick={() => {
            props.selectedSurveyFunc(props.allDatas)
            props.setVPUOFunc(true)
          }}>
            Oy Ver
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}


function CreateSurveyPopUp(props) {
  const [options, setOptions] = useState(["", ""]);
  const [question, setQuestion] = useState("");
  const questionElement = useRef();
  const popUpRef = useRef();
  const [postSended,setPostSended]=useState(false);
  // Function to handle clicks outside the pop-up
  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      props.setCPUOFunc(false)
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the pop-up
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveOption = (index) => {
    if (options.length < 3) {
      return;
    }
    const newOptions = options.filter((_, idx) => idx !== index);
    setOptions(newOptions);
  };

  return (
    <Grid container
      sx={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <IconButton
        sx={{
          color: 'white',
          backgroundColor: 'red',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
          padding: '8px',
          borderRadius: '50%',
        }}
      >
        <CloseIcon />
      </IconButton>

      <Grid item xs={12} sm={8} md={9} lg={5} sx={{ padding: "20px" }} ref={popUpRef}>
        <Paper
          elevation={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "80vh",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginTop: "30px" }}>
            Kendi Anketini Oluştur
          </Typography>
          <Stack direction={"column"} spacing={2} sx={{ width: "90%", height: "65%" }}>
            <TextField autoComplete="off" spellCheck={false} label="Sorunuzu Giriniz" variant="outlined" onChange={(e) => { setQuestion(e.target.value); }} ref={questionElement} />
            <Divider>
              <Chip label="Şıklar" size="small" />
            </Divider>
            <Stack direction={"column"} spacing={2}
              sx={{
                width: "100%", paddingTop: "1rem", overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#1976d2",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f5f5f5",
                },
              }}>
              {options.map((data, id) => {
                return (
                  <Stack direction="row" spacing={1} key={id} sx={{ alignItems: "center" }}>
                    <TextField
                      spellCheck={false}
                      autoComplete="off"
                      label={id + 1 + ". seçeneği giriniz"}
                      variant="outlined"
                      sx={{ flex: 1 }}
                      value={options[id]}  // Set the TextField value to the current option
                      onChange={(e) => {
                        const updatedOptions = [...options];  // Make a copy of the options array
                        updatedOptions[id] = e.target.value;  // Update the option at the specific index
                        setOptions(updatedOptions);  // Update the state with the new options array
                      }}

                    />
                    <IconButton onClick={() => handleRemoveOption(id)} color="error" disabled={options.length < 3 ? true : false}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
              {options.length < 8 && <Button variant="outlined" onClick={() => setOptions([...options, ""])} endIcon={<AddIcon />} size="large">
                Şık Ekle
              </Button>}
            </Stack>
          </Stack>

          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <Button variant="contained" size='large' onClick={() => {
              if (!question) {
                props.showAlertFunc("warning", "Bir soru yazmalısınız");
                return;
              }
              for (var i = 0; i < options.length; i++) {
                if (!options[i]) {
                  props.showAlertFunc("warning", "Tüm şıkları doldurmalısınız.");
                  return;
                }
              }
              try {
                if(postSended){
                  return;
                }
                setPostSended(true)
                AnoSurvey_backend.createPoll(question, options).then((data) => {
                  data = parseInt(data);
                  props.showAlertFunc("success", "Harika anketin yayında!");
                  props.setCPUOFunc(false);
                  questionElement.current.value = "";
                  props.fetchFunc();
                  setPostSended(false)
                });
              }
              catch (error) {
                props.showAlertFunc("error", "Bir şeyler ters gitti lütfen geliştiriciye ulaşın.");
                console.error('Bir hata oluştu:', error.message);
              }
            }} sx={{ width: "60%" }}>
              <Typography variant="h6">
                YAYINLA
              </Typography>
            </Button>
          </Box>

        </Paper>
      </Grid>
    </Grid>
  );
}

function VoteSurveyPopUp(props) {
  const popUpRef = useRef();
  const [survey, setSurvey] = useState(JSON.parse(JSON.stringify(props.survey)))

  const [isAnswered, setIsAnswered] = useState(false);

  const [chosenOpt, setCo] = useState(-1);
  useEffect(() => {
    for (let i = 0; i < props.votedPolls.length; i++) {
      if (props.votedPolls[i][0] === survey.id) {
        setIsAnswered(true);
        setCo(props.votedPolls[i][1]);
        break;
      }
    }
  }, [props.votedPolls, survey.id]);
  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      props.setVPUOFunc(false)
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the pop-up
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  let { question, results } = survey;
  let voteSum = results.reduce((sum, item) => sum + item[1], 0);
  return (
    <Grid container
      sx={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <IconButton
        sx={{
          marginRight: "40px",
          color: 'white',
          backgroundColor: 'red',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
          padding: '8px',
          borderRadius: '50%',
        }}
      >
        <CloseIcon />
      </IconButton>

      <Grid item xs={10} sm={8} md={9} lg={5} sx={{ padding: "20px" }} ref={popUpRef}>

        <Paper
          elevation={5}
          sx={{

            height: "80vh",
            width: "100%",
            padding: "30px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "-30px",


          }}
        >


          <Typography variant="h4" sx={{ width: "100%", marginBottom: "30px" }}>
            {question}
          </Typography>
          <Divider sx={{ width: "100%" }}>
            <Chip label="Şıklar" size="small" />
          </Divider>
          <Stack spacing={2} sx={{ width: "100%", marginTop: "40px" }}>
            {results.map((item, id) => {
              return <Stack key={id} sx={{ alignItems: "center" }} spacing={2} direction={"row"}>
                <Button
                  onClick={() => {
                    if (isAnswered) {
                      return;
                    }
                    setSurvey(props.survey)
                    setCo(id);
                    let newSurvey = JSON.parse(JSON.stringify(props.survey));
                    newSurvey.results[id][1]++;
                    setSurvey(newSurvey)


                  }}
                  variant={id == chosenOpt ? "contained" : "outlined"}
                  disabled={isAnswered && id != chosenOpt}

                  size='large' sx={{ width: "100%", fontSize: "1.5rem", position: "relative" }}>
                  {item[0]}<Typography sx={{ right: "30px", position: "absolute" }} variant="h4" >%{item[1] / voteSum * 100 ? parseInt(item[1] / voteSum * 100) : 0}</Typography></Button>

              </Stack>
            })}</Stack>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <Button disabled={isAnswered} variant="contained" size='large' sx={{ width: "60%", position: "absolute", bottom: "20px" }} onClick={() => {
              if (chosenOpt === -1) {
                props.showAlertFunc("warning", "Önce bir seçeneği seçmelisin");
                return;

              }
              try {
                AnoSurvey_backend.vote(survey.id, chosenOpt, props.voterId).then((data) => {

                  if (data.err) {
                    props.showAlertFunc("warning", "Zaten oy verdin");
                    return;
                  }
                  setIsAnswered(true);
                  props.setVotedPolls([...props.votedPolls, [survey.id, chosenOpt]])
                  localStorage.setItem("votedPolls", JSON.stringify([...props.votedPolls, [survey.id, chosenOpt]]));

                  props.showAlertFunc("success", "Verdiğin oy başarıyla kaydedildi.");
                  props.fetchFunc();

                  return;
                })
              }
              catch (error) {
                props.showAlertFunc("error", "Bir şeyler ters gitti lütfen geliştiriciye ulaşın.");
                console.error('Bir hata oluştu:', error.message);
              }


            }} >
              <Typography variant="h6">
                Kaydet
              </Typography>
            </Button>
          </Box>



        </Paper>
      </Grid>

    </Grid>
  );
}



export default App;
