import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';

const CreateTasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;

    const surahData = [
        { key: '1', value: 'Al-Fatiha', ayahs: [1, 2, 3, 4, 5, 6, 7] },
        { key: '2', value: 'Al-Baqarah', ayahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { key: '3', value: 'Al-Imran', ayahs: [1, 2, 3, 4, 5] },
    ];
    const [tasbeehTitle, setTasbeehTitle] = useState('');
    const [count, setCount] = useState('');
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [ayahOptions, setAyahOptions] = useState([]);
    const [selectedAyahFrom, setSelectedAyahFrom] = useState(null);
    const [ayahToOptions, setAyahToOptions] = useState([]);
    const [selectedAyahTo, setSelectedAyahTo] = useState(null);
    const [quranid, setquranid] = useState(null);
    const [qurantasbeehdata, setqurantasbeehdata] = useState([]);
    const [compund, setcompund] = useState([]);
    const Addtitle = async () => {
        try {
            const Tasbeeh = {
                "Tasbeeh_Title": tasbeehTitle,
                "User_id": Userid
            };
            const response = await fetch(tasbeehurl + "createtasbeehtitle", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Tasbeeh)
            });

            if (response.ok) {
                const ans = await response.json();
                
                return ans;
               
            } else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const Addqurantasbeeh = async () => {
        try {
            if (selectedSurah && selectedAyahFrom && selectedAyahTo && count) {
                const surahName = surahData.find(surah => surah.key === selectedSurah)?.value;
                const tasbeehData = {
                    surahName: surahName,
                    ayahNumberFrom: selectedAyahFrom,
                    ayahNumberTo: selectedAyahTo,
                    count: count
                };

                const queryString = new URLSearchParams(tasbeehData).toString();

                const response = await fetch(`${tasbeehurl}addqurantasbeeh?${queryString}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const ans = await response.json();
                    setqurantasbeehdata([...qurantasbeehdata, ...ans]);
                    ans.forEach(element => {
                        setquranid(element.ID)
                    });
                   
                } else {
                    const ans = await response.text();
                    console.log(ans);
                }
            } else {
                console.log("Please fill all the fields.");
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const Compundtasbeehdata = async () => {
        var id= await Addtitle();
          if(id){
            try {
                const updatedCompund = compund.map((element) => ({
                    ...element,
                    Tasbeeh_id: id,
                }));
                const response = await fetch(tasbeehurl + "createcoumpoundtasbeeh", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCompund),
                });
    
                if (response.ok) {
                    const ans = await response.text();
                    console.log(ans);
                    Compundtasbeeh = [];
                    navigation.navigate('Alltasbeeh', {
                        "Userid": Userid
                    })
                } else {
                    const ans = await response.text();
                    console.log("Error:", ans);
                }
            } catch (error) {
                console.log(error.message);
            }
          }
         
    };
    const handleSurahChange = (surahKey) => {
        setSelectedSurah(surahKey);
        const selected = surahData.find((s) => s.key === surahKey);
        if (selected) {
            const ayahList = selected.ayahs.map((ayah) => ({
                key: ayah.toString(),
                value: ayah.toString(),
            }));
            setAyahOptions(ayahList);
            setSelectedAyahFrom(null);
            setSelectedAyahTo(null);
            setAyahToOptions([]);
        }
    };

    const handleAyahFromChange = (ayahFromKey) => {
        setSelectedAyahFrom(ayahFromKey);
        const startAyah = parseInt(ayahFromKey, 10);
        const filteredAyahs = ayahOptions.filter(
            (ayah) => parseInt(ayah.key, 10) >= startAyah
        );
        setAyahToOptions(filteredAyahs);
        setSelectedAyahTo(null);
    };
    const showdata = ({ item }) => (
        <View style={{ marginVertical: 10 }}>
            <Text style={{ color: 'black', fontSize: 16 }}>Surah Name:{item.Sura_name}</Text>
            <Text style={{ color: 'black', fontSize: 14 }}>Text:{item.Ayah_text}</Text>
        </View>
    );
    useEffect(() => {
        if(quranid){
            var obj={"Quran_Tasbeeh_id":quranid
            };
            setcompund([...compund,obj])
            console.log(quranid);
        }
        console.log("Final compund state after update:", compund);
        
    }, [quranid]);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Tasbeeh</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Tasbeeh Title</Text>
                <TextInput
                    style={[styles.input, { color: 'black' }]}
                    placeholder="Enter Tasbeeh Title"
                    placeholderTextColor="#A9A9A9"
                    value={tasbeehTitle}
                    onChangeText={setTasbeehTitle}
                />
            </View>

            <View style={styles.mainasbeehForm}>
                <View style={styles.tasbeehForm}>
                    <View style={styles.tasbeehFormLabels}>
                        <Text style={styles.formLabel}>Surah Name</Text>
                        <Text style={styles.formLabel}>Ayah From</Text>
                        <Text style={styles.formLabel}>Ayah To</Text>
                        <Text style={styles.formLabel}>Count</Text>
                    </View>

                    <View style={styles.tasbeehFormInputs}>
                        <SelectList
                            data={surahData}
                            setSelected={handleSurahChange}
                            placeholder="Select Surah"
                            search={false}
                            boxStyles={{
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 20,
                                marginBottom: 10,
                            }}
                            inputStyles={{
                                color: 'black',
                            }}
                            dropdownStyles={{
                                backgroundColor: 'white',
                            }}
                            dropdownTextStyles={{
                                color: 'black',
                            }}
                        />
                        <SelectList
                            data={ayahOptions}
                            setSelected={handleAyahFromChange}
                            placeholder="Select Ayah From"
                            search={false}
                            boxStyles={{
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 20,
                                marginBottom: 10,
                            }}
                            inputStyles={{
                                color: 'black',
                            }}
                            dropdownStyles={{
                                backgroundColor: 'white',
                            }}
                            dropdownTextStyles={{
                                color: 'black',
                            }}
                        />
                        <SelectList
                            data={ayahToOptions}
                            setSelected={setSelectedAyahTo}
                            placeholder="Select Ayah To"
                            search={false}
                            boxStyles={{
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 20,
                                marginBottom: 10,
                            }}
                            inputStyles={{
                                color: 'black',
                            }}
                            dropdownStyles={{
                                backgroundColor: 'white',
                            }}
                            dropdownTextStyles={{
                                color: 'black',
                            }}
                        />
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Enter Count"
                            placeholderTextColor="#A9A9A9"
                            keyboardType="numeric"
                            value={count}
                            onChangeText={setCount}
                        />
                    </View>
                </View>
                <View style={{ width: "40%" }}>
                    <TouchableOpacity onPress={() => { Addqurantasbeeh() }} style={styles.button}>
                        <Text style={styles.buttonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={qurantasbeehdata}
                renderItem={showdata}
            />
            <View style={{ width: "100%", justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={()=>{
                    
                    Compundtasbeehdata(); 
             
                    

                }} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        flex: 1,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
    },
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 100,
    },
    tasbeehForm: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    mainasbeehForm: {
        backgroundColor: colors.tasbeehconatiner || '#f0f0f0',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    tasbeehFormLabels: {
        flex: 1,
    },
    tasbeehFormInputs: {
        flex: 2,
    },
    formLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 34,
    },
    smallInput: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: 'black',
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: "10%",
        borderRadius: 30,
        marginTop: 10,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
});

export default CreateTasbeeh;
