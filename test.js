const axios = require('axios')
const fs = require("fs")

async function writeUrl (chpNumber, imgNumber, formatChapter, formatImg) {
    const formattedImgNb = imgNumber.toString().length === 1 ? `0${imgNumber}` : imgNumber
    let url = `https://www.scan-vf.net/uploads/manga/one_piece/chapters/${formatChapter}/${formattedImgNb}.${formatImg}`
    await axios.get(url);
    var logStream = fs.createWriteStream('getlist11_autre.sh', {flags: 'a'});
    logStream.write("wget " + url + ` -O chapitre-${chpNumber}_${formattedImgNb}.${formatImg}` + "\r\n");
}
async function createUrlList(chapitreNb) {
    let i = 1
    let is404 = false
    let failedAttemps = 0;
    while (!is404) {
        try {
            console.log('trying for chapter ', chapitreNb, ' and i = ', i)
            await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'webp')
            i = i + 1;
        } catch (err) {
            if (err.response.status === 404) {
                try {
                    await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'png')
                    i = i + 1;
                } catch (err) {
                    try {
                        await writeUrl(chapitreNb, i, `${chapitreNb}`, 'webp')
                        i = i + 1;
                    } catch (err) {
                        if (err.response.status === 404) {
                            try {
                                await writeUrl(chapitreNb, i, `${chapitreNb}`, 'png')
                                i = i + 1;
                            } catch (err) {
                                if (err.response.status === 404) {
// -------------------
                                    try {
                                        await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'JPG')
                                        i = i + 1;
                                    } catch (err) {
                                        if (err.response.status === 404) {
                                            try {
                                                await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'jpeg')
                                                i = i + 1;
                                            } catch (err) {
                                                try {
                                                    await writeUrl(chapitreNb, i, `${chapitreNb}`, 'JPG')
                                                    i = i + 1;
                                                } catch (err) {
                                                    if (err.response.status === 404) {
                                                        try {
                                                            await writeUrl(chapitreNb, i, `${chapitreNb}`, 'jpeg')
                                                            i = i + 1;
                                                        } catch (err) {
                                                            if (err.response.status === 404) {
                                                                try {
                                                                    await writeUrl(chapitreNb, i, `${chapitreNb}`, 'JPEG')
                                                                    i = i + 1;
                                                                } catch (err) {
                                                                    if (err.response.status === 404) {
                                                                        try {
                                                                            await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'JPEG')
                                                                            i = i + 1;
                                                                        } catch (err) {
                                                                            if (err.response.status === 404) {
                                                                                try {
                                                                                    await writeUrl(chapitreNb, i, `${chapitreNb}`, 'jpg')
                                                                                    i = i + 1;
                                                                                } catch (err) {
                                                                                    if (err.response.status === 404) {
                                                                                        try {
                                                                                            await writeUrl(chapitreNb, i, `chapitre-${chapitreNb}`, 'jpg')
                                                                                            i = i + 1;
                                                                                        } catch (err) {
                                                                                            if (err.response.status === 404) {
                                                                                                console.log('could not find anything for chapter ', chapitreNb, ' and i = ', i)
                                                                                                failedAttemps = failedAttemps + 1;
                                                                                            }
                                                                                            if (i < 15 && failedAttemps < 4) {
                                                                                                console.log('----------- end of chapitre ' + chapitreNb + ' at ' + i + '--------')
                                                                                                i = i + 1;
                                                                                            }
                                                                                            if (i > 15 || failedAttemps > 3) {
                                                                                                console.log('----------- definitive end of chapitre ' + chapitreNb + ' at ' + i + '--------')
                                                                                                is404 = true
                                                                                            }
                                                                                        }                                                                    }
                                                                                }                                                                            }
                                                                        }                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // -------------------
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}

// async function createUrlList(chapitreNb) {
//     let i = 1
//     let is404 = false
//     while (!is404) {
//         try {
//             let url = `https://www.scan-vf.net/uploads/manga/one_piece/chapters/chapitre-${chapitreNb}/${i.toString().length === 1 ? `0${i}` : i}.jpg`
//             await axios.get(url);
//             i = i + 1;
//             var logStream = fs.createWriteStream('urls5.txt', {flags: 'a'});
//             logStream.write(url + "\r\n");
//         } catch (err) {
//             if (err.response.status === 404) {
//                 // is404 = true
//                 try {
//                     let url = `https://www.scan-vf.net/uploads/manga/one_piece/chapters/chapitre-${chapitreNb}/${i.toString().length === 1 ? `0${i}` : i}.png`
//                     await axios.get(url);
//                     i = i + 1;
//                     var logStream = fs.createWriteStream('urls5.txt', {flags: 'a'});
//                     logStream.write(url + "\r\n");
//                 } catch (err) {
//                     try {
//                         let url = `https://www.scan-vf.net/uploads/manga/one_piece/chapters/${chapitreNb}/${i.toString().length === 1 ? `0${i}` : i}.jpg`
//                         await axios.get(url);
//                         i = i + 1;
//                         var logStream = fs.createWriteStream('urls5.txt', {flags: 'a'});
//                         logStream.write(url + "\r\n");
//                     } catch (err) {
//                         if (err.response.status === 404) {
//                             // is404 = true
//                             try {
//                                 let url = `https://www.scan-vf.net/uploads/manga/one_piece/chapters/${chapitreNb}/${i.toString().length === 1 ? `0${i}` : i}.png`
//                                 await axios.get(url);
//                                 i = i + 1;
//                                 var logStream = fs.createWriteStream('urls5.txt', {flags: 'a'});
//                                 logStream.write(url + "\r\n");
//                             } catch (err) {
//                                 if (i < 15) {
//                                     console.log('----------- end of chapitre ' + chapitreNb + ' at ' + i + '--------')
//                                 }
//                                 if (err.response.status === 404) {
//                                     is404 = true
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//
//     }
// }

async function fetchFiles() {
    for (let i = 1036; i < 1046; i++) { //45
        await createUrlList(i)
    }
    // await createUrlList(1034)
}

fetchFiles()

/**
 * 1. Récupérer les urls des chapitres en regardant leur forme (qu'on a bien toujours 01, 02... et pas 0001, etc.) et en modifiant
 *    la méthode fetchFiles
 * 2. Créer le script bash en ajoutant devant l'url "wget" puis l'url puis "-O" puis le nom du fichier à créer (ne pas oublier l'extension)
 * 3. se placer dans un dossier et lancer "chmod 775 xxxxx.sh" puis le script "sudo ./xxxx.sh"
 * 4. S'il y a des .png : "mogrify -format jpg *.png" puis "rm -f *.png"
 * 4. Jouer "img2pdf chapitre* --output OnePiecexxxxxxxxx.pdf"
 */