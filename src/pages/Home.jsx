import GigCard from '@/components/GigCard';
import { Button, Container, Flex, IconButton, Input } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { LuSearch } from 'react-icons/lu'

const Home = () => {

    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);


    const handleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/gigs/search?keyword=${keyword}`);
          
            setSearchResults(res.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (

        <Container marginTop={"1rem"}>
            <Flex>
                <Input
                    placeholder="What service are you looking for?"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} />
                <IconButton padding={3} borderTopLeftRadius={0} borderBottomLeftRadius={0} aria-label='Search gigs' onClick={handleSearch}>
                    <LuSearch />
                    Search
                </IconButton>
            </Flex>

            <div style={{ marginTop: "2rem" }}>
                {searchResults.length > 0 ? (
                    <Flex  gap={50} flexWrap={'wrap'} className="gig-list">
                        {searchResults.map((gig) => (
                            <GigCard key={gig.id} gig={gig} />
                        ))}
                    </Flex>
                ) : (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                        Search for gigs above 👆
                    </p>
                )}
            </div>
        </Container>

    )
}

export default Home
