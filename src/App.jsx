import { useRef, useState } from 'react'
import './index.css'
import gsap from 'gsap'
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Listbox,
    ListboxSection,
    ListboxItem
} from '@nextui-org/react'
import { IoCloseOutline } from 'react-icons/io5'
import { cn } from '@nextui-org/react'
import { FiMenu } from 'react-icons/fi'
import { gql, useQuery } from '@apollo/client';
import CharacterList from './components/CharacterList'
import CharacterByLocation from './components/CharacterByLocation'
import { FaMapPin } from 'react-icons/fa6'
import toast, { Toaster } from 'react-hot-toast';

const GET_CHARACTER = gql`
query{
  characters{
    results{
      id
      name
      status
      species
      type
      gender
      image
    }
  }
  locations{
    results{
      id
      name
      type
      dimension
    }
  }
}
`;

const App = () => {
    const { loading, error, data } = useQuery(GET_CHARACTER);

    const detailSection = useRef(null)
    const detailOverlay = useRef(null)
    const menuSection = useRef(null)
    const [selectedMenu, setSelectedMenu] = useState('Character List')
    const [selectedCharacter, setSelectedCharacter] = useState({
        "id": 0,
        "name": "-",
        "status": "-",
        "species": "-",
        "type": "-",
        "gender": "-",
        "origin": {
            "name": "-",
            "url": "-"
        },
        "locations": null,
        "image": "-",
    })
    const [inputedLocation, setInputedLocation] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [selectedLocationDetail, setSelectedLocationDetail] = useState(null)
    const [locations, setLocations] = useState(localStorage.getItem('locations') ? JSON.parse(localStorage.getItem('locations')) : [])
    const [isDisabled, setIsDisabled] = useState(true)
    const [detailType, setDetailType] = useState('character')

    if (loading) {
        return <div>Loading...</div>
    } else {
        if (localStorage.getItem('characters') == null) {
            const characterArray = data.characters.results.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    species: item.species,
                    gender: item.gender,
                    type: item.type,
                    image: item.image,
                    locations: null
                }
            })

            localStorage.setItem('characters', JSON.stringify(characterArray))
        }
    }

    gsap.registerPlugin()

    const openMenuSection = () => {
        gsap.to(menuSection.current, {
            left: 0,
            duration: 0.5,
            ease: 'sine.inOut'
        })

        gsap.to(detailOverlay.current, {
            opacity: 0.5,
            zIndex: 20,
            duration: 0.5,
            ease: 'sine.inOut'
        })
    }

    const closeMenuSection = (menu) => {
        if (menu == 'Character List') {
            setSelectedMenu('Character List')
        } else if (menu == 'Character By Locations') {
            setSelectedMenu('Character By Locations')
        }

        console.log(menu)
        gsap.to(menuSection.current, {
            left: '-100%',
            duration: 0.5,
            ease: 'sine.inOut'
        })

        gsap.to(detailOverlay.current, {
            opacity: 0,
            zIndex: 0,
            duration: 0.5,
            ease: 'sine.inOut'
        })
    }

    const openDetailSection = (data, type) => {
        gsap.to(detailSection.current, {
            right: 0,
            duration: 0.5,
            ease: 'sine.inOut'
        })

        gsap.to(detailOverlay.current, {
            opacity: 0.5,
            zIndex: 20,
            duration: 0.5,
            ease: 'sine.inOut'
        })

        if (type == 'character') {
            setDetailType('character')
            setSelectedCharacter(data)
        } else {
            setDetailType('location')
            setSelectedLocationDetail(data)
        }
    }

    const closeDetailSection = () => {
        gsap.to(detailSection.current, {
            right: '-100%',
            duration: 0.5,
            ease: 'sine.inOut'
        })

        gsap.to(detailOverlay.current, {
            opacity: 0,
            zIndex: 0,
            duration: 0.5,
            ease: 'sine.inOut'
        })
    }

    const addNewLocation = () => {
        if (localStorage.getItem('locations') != null) {
            const locations = JSON.parse(localStorage.getItem('locations'))
            locations.push({
                id: locations.length + 1,
                name: inputedLocation,
                residents: []
            })
            localStorage.setItem('locations', JSON.stringify(locations))
            setLocations(locations)
        } else {
            const locations = []
            locations.push({
                id: 1,
                name: inputedLocation,
                residents: []
            })
            localStorage.setItem('locations', JSON.stringify(locations))
            setLocations(locations)
        }

        toast.success('Location added successfully')
    }

    const onInputChange = (value) => {
        setInputedLocation(value)
    }

    const onSelectionChange = (item) => {
        if (item != null) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }

        const locations = JSON.parse(localStorage.getItem('locations'))
        const index = locations.findIndex((location) => location.id == item)
        setSelectedLocation({
            id: locations[index].id,
            name: locations[index].name,
        })
    }

    const saveLocation = () => {
        const characters = JSON.parse(localStorage.getItem('characters'))
        const characterIndex = characters.findIndex((item) => item.id == selectedCharacter.id)
        characters[characterIndex].locations = selectedLocation
        localStorage.setItem('characters', JSON.stringify(characters))
        setSelectedCharacter(characters[characterIndex])

        const locations = JSON.parse(localStorage.getItem('locations'))
        const locationIndex = locations.findIndex((location) => location.id == selectedLocation.id)
        locations[locationIndex].residents.push(selectedCharacter.id)
        localStorage.setItem('locations', JSON.stringify(locations))

        toast.success('Location assigned successfully')
    }

    const findCharacterById = (id) => {
        const characters = JSON.parse(localStorage.getItem('characters'))
        const characterIndex = characters.findIndex((item) => item.id == id)
        return characters[characterIndex]
    }

    return (
        <>
            <Toaster />
            <aside ref={menuSection} className="bg-white h-screen w-2/3 md:w-1/5 absolute -top-0 -left-full z-40 will-change-transform p-3">
                <div className='flex justify-end'>
                    <IoCloseOutline className='text-2xl rounded-full bg-gray-200 p-1' onClick={() => closeMenuSection('close')} />
                </div>
                <h1 className='text-sm font-bold mb-4'>Ricky and Morty Characters</h1>
                <ul className='flex flex-col gap-2 mt-2 cursor-pointer'>
                    <li className='text-xl font-light flex items-center gap-2' onClick={() => closeMenuSection('Character List')}><FaMapPin className={cn('text-2xl', selectedMenu == 'Character List' ? '' : 'hidden')} />Characters List</li>
                    <li className='text-xl font-light flex items-center gap-2' onClick={() => closeMenuSection('Character By Locations')}><FaMapPin className={cn('text-2xl', selectedMenu == 'Character By Locations' ? '' : 'hidden')} />Locations List</li>
                </ul>
            </aside>
            <div className='bg-slate-100 w-full min-h-screen max-h-full px-3 py-2 z-10 relative overflow-hidden'>
                <h1 className='text-xl font-semibold text-black mb-4 flex items-center gap-2'><FiMenu onClick={openMenuSection} />{selectedMenu == 'Character List' ? 'Character List' : 'Locations List'}</h1>
                {
                    selectedMenu == 'Character List' ?
                        <CharacterList openDetailSection={openDetailSection} data={JSON.parse(localStorage.getItem('characters'))} />
                        :
                        <CharacterByLocation openDetailSection={openDetailSection} data={JSON.parse(localStorage.getItem('locations'))} />
                }
            </div>
            <aside ref={detailSection} className="bg-white h-screen w-3/4 md:w-1/5 fixed top-0 -right-full z-30 py-2 px-4 will-change-transform flex flex-col gap-4">
                {detailType == 'character' ?
                    <>
                        <div className='flex w-full justify-between items-center'>
                            <IoCloseOutline className='text-2xl rounded-full bg-gray-200 p-1' onClick={closeDetailSection} />
                            <h1 className='font-semibold text-lg'>Character Detail</h1>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <img src={selectedCharacter.image} className='size-36 rounded-full' />
                            <h1 className='text-xl font-bold'>{selectedCharacter.name}</h1>
                            <div className='flex items-baseline justify-center w-full gap-1 mt-2'>
                                <div className={cn('size-3 rounded-full', selectedCharacter.status == 'Alive' ? 'bg-green-600' : selectedCharacter.status == 'Dead' ? 'bg-red-500' : 'bg-gray-400')}></div>
                                <h1 className='text-xs font-semibold text-gray-500'>{selectedCharacter.status}</h1>
                            </div>
                            <div className='w-full h-auto flex flex-col justify-start items-start gap-3 mt-7'>
                                <div>
                                    <h3 className='text-sm font-light tracking-wide'>Species:</h3>
                                    <h1 className='text-xl font-extralight'>{selectedCharacter.species}</h1>
                                </div>
                                <div>
                                    <h3 className='text-xs font-light tracking-wide'>Type:</h3>
                                    <h1 className='text-xl font-extralight'>{selectedCharacter.type.length !== 0 ? selectedCharacter.type : '-'}</h1>
                                </div>
                                <div>
                                    <h3 className='text-xs font-light tracking-wide'>Gender:</h3>
                                    <h1 className='text-xl font-extralight'>{selectedCharacter.gender}</h1>
                                </div>
                                <div className={cn('flex flex-col', selectedCharacter.locations != null ? '' : 'gap-3')}>
                                    <h3 className='text-xs font-light tracking-wide'>Locations:</h3>
                                    {
                                        selectedCharacter.locations != null ?
                                            <h1 className='text-xl font-extralight'>{selectedCharacter.locations.name}</h1>
                                            :
                                            <>
                                                <Autocomplete
                                                    label="Select a location"
                                                    className="max-w-xs"
                                                    defaultItems={locations}
                                                    onInputChange={onInputChange}
                                                    onSelectionChange={onSelectionChange}
                                                    size='sm'
                                                    listboxProps={{
                                                        emptyContent: inputedLocation.length != 0 ? <div>Click <span className='underline cursor-pointer' onClick={addNewLocation}>here</span> to add <b>{inputedLocation}</b></div> : <div>No location found</div>
                                                    }}
                                                >
                                                    {(item) => <AutocompleteItem key={item.id} value={item}>{item.name}</AutocompleteItem>}
                                                </Autocomplete>
                                                <Button size='sm' className='w-15 self-end animate-pulse' isDisabled={isDisabled} onPress={saveLocation}>Assign Location</Button>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className='flex w-full justify-between items-center'>
                            <IoCloseOutline className='text-2xl rounded-full bg-gray-200 p-1' onClick={closeDetailSection} />
                            <h1 className='font-semibold text-lg'>Characters By Location</h1>
                        </div>
                        <div className='flex flex-col w-full justify-center items-center gap-1'>
                            <h3 className='text-sm'>Location:</h3>
                            <h1 className='text-2xl'>{selectedLocationDetail.name}</h1>
                        </div>
                        <div className='flex flex-col w-full gap-1'>
                            <h3 className='text-sm'>Residents:</h3>
                            <Listbox
                                aria-label="Actions"
                                onAction={(key) => alert(key)}
                            >
                                {
                                    selectedLocationDetail.residents.length !== 0 ?
                                        selectedLocationDetail.residents.map((resident) => {
                                            const character = findCharacterById(resident)

                                            return (<ListboxItem key={character.id}>
                                                <div className='flex gap-2 items-center'>
                                                    <img src={character.image} className='size-10 sm:size-12 rounded-full' />
                                                    <div>
                                                        <h1 className='text-md sm:text-lg font-semibold'>{character.name}</h1>
                                                        <div className='flex items-center gap-1'>
                                                            <div className={cn('size-2 rounded-full', character.status == 'Alive' ? 'bg-green-600' : selectedCharacter.status == 'Dead' ? 'bg-red-500' : 'bg-gray-400')}></div>
                                                            <h1 className='text-xs sm:text-sm'>{character.status}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ListboxItem>)
                                        })
                                        :
                                        <ListboxItem key="empty">No resident found</ListboxItem>
                                }
                            </Listbox>
                        </div>
                    </>
                }

            </aside>
            <div ref={detailOverlay} className='bg-black h-screen w-screen fixed top-0 left-0 z-0 opacity-0 will-change-transform'
                onClick={() => {
                    closeDetailSection()
                    closeMenuSection('close')
                }}>
            </div>
        </>
    )
}

export default App
