**DODAJ CACHE**
Aplikacja za każdym razem ściąga dane z API nawet jak nie są wyświetlane
*Przykład*
Wchodzę w zakładkę Siłownia/Finanse i ściąga pogodę z API w rezultacie idzie za dużo requestów
Aplikacja powinna ściągać co godzinę pogodę, zapisywać w cache i wyjebane. Jak wchodzę znowu na główną to ściąga z cache a nie z API
To pozwoli zaoszczędzić requesty API.