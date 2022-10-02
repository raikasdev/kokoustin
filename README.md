# kokoustin

Sovellus nuorisovaltuuston kokousten pöytäkirjoihin.

## Käyttöönotto

Kokoustin käyttää Supabase palvelua pöytäkirjatietojen synkronointiin.\
Tarvitset Github-tunnuksen projektin kopiointiin sekä Supabaseen-rekisteröintiin.

Mene <https://supabase.io/> ja rekisteröidy oikeasta yläkulmasta.\
Seuraa Supabasen ohjeita ja luo uusi organisaatio ja projekti.\
Mene vasemmalta table editoriin ja luo uusi table.\
Tablen nimeksi "data". Vaihda "id" kentän nimeksi version, poista created_at ja luo uusi kenttä.\
Aseta kentän nimeksi "json" ja tyypiksi "text". Laita default valueksi "[]" ja paina asetusvalikosta "Is nullable" pois.\
Luo taulu.

Seuraavaksi mene supabasen asetuksiin vasemmalta alhaalta, valitse "API".\
Jätä sivu auki, tarvitsemme sieltä URLin ja julkisen avaimen myöhempää varten.

Seuraavaksi mene <https://github.com/raikasdev/kokoustin> sivulle, ja paina oikealta ylhäältä fork.\
Tämä luo omalle käyttäjällesi kopion koodista. Avaa tiedosto "config.json" ja muokkaa tiedot omalle nuorisovaltuustolle sopivaksi.

council "Nuorisovaltuutetut"

{\
  "name": "Niilo Nuoriso",                              --- Nuorisovaltuutetun nimi\
  "role": "Jäsen",                                      --- Nuorisovaltuutetun rooli kokouksissa\
  "mainMemberName": "Silja Piirainen",                  --- Mikäli nuorisovaltuutettu on vararoolissa (Varapuheenjohtaja tms), tähän pääjäsenen nimi\
  "roleIfMainMemberAbsent": "Puheenjohtaja (varalla)"   --- Pääjäsenen poissaollessa käyttäjän rooli pöytäkirjassa\
}

defaultOther "Yleensä paikalla olevat muut puhe- ja läsnäolo-oikeutetut":

{\
  "name": "Kaija EL ibourki",        --- Henkilön nimi\
  "role": "Nuorisovaltuuston tutor"  --- Henkilön rooli\
}

defaultLocation "Kokousten oletuspaikka"

roleOrder: "Nuorisovaltuutettujen roolien järjestys pöytäkirjassa"

{\
  "Puheenjohtaja": 3,\
  "Roolin nimi tähän": Järjestysluku (isompi ensin),\
}

pdftitleprefix "PDF-tiedostojen prefix"\
--- Se mitä tulee pdf otsikoihin, esim "Jämsän nuorisovaltuuston kokous" Tämän jälkeen tulee päivämäärä

Tallenna tiedosto.

Tämän jälkeen rekisteröidy <https://vercel.com/> palveluun, ja paina add new -> project.\
Paina continue with github. Kirjaudu githubin avulla ja salli omiin repositoryihin pääsy.\
Valitse listasta kokoustin.

Avaa "Environment variables" valikko.\
Kirjoita ensin nameksi NEXT_PUBLIC_SUPABASE_URL ja kopioi supabasen asetussivulta URL kohdasta arvo value-kohtaan.\
Sitten kirjoita NEXT_PUBLIC_SUPABASE_API_KEY ja etsi supabasesta "anon public" api key.

Sen jälkeen paina deploy nappia.\
Odota hetki. Tämän jälkeen sovelluksen pitäisi toimia.

## TODO

- Add support for authentication
- Version history (and choose history) from database
