import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

interface Recipe {
    label: string;
    image: string;
    url: string;
}

interface ApiResponse {
    hits: {
        recipe: Recipe;
    }[];
}

export const RecipeSearch = () => {
    const [inpVal, setInpVal] = useState<string>("");
    const [apiData, setApiData] = useState<ApiResponse["hits"]>([]); 
    const [errorState, setErrorState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const recipe: string[] = [
        "Biryani", "Pulao", "Burger", "Chicken Karahi", "Haleem", "Kheer", "Pizza"
    ];

    const handleRecipeBtn = (value: string) => {
        setInpVal(value);
    };

    const handleSearchBtn = async () => {
        setLoading(true);
        setErrorState(false);
        const api = `https://api.edamam.com/search?q=${inpVal}&app_id=ed12ea02&app_key=60a8da0866d3c16989e0032c0401b918`;
        try {
            const response = await fetch(api);
            if (!response.ok) throw new Error("Recipe Not Found");
            const data: ApiResponse = await response.json();
            setApiData(data.hits);
        } catch (error) {
            console.log(error)
            setErrorState(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 style={{ fontFamily: "Anybody" }} className="text-gray-900 font-black text-center mb-5 text-4xl bg-orange_color ps-6 py-4 md:text-6xl lg:text-6xl">
                RECIPE SEARCH
            </h1>
            <div className="flex justify-center flex-wrap mb-4">
                {
                    recipe.map((crntele: string) => (
                        <span
                            key={crntele} 
                            className="rounded-xl bg-gray-300 text-slate-600 p-3 m-3 cursor-pointer"
                            onClick={() => handleRecipeBtn(crntele)}
                        >
                            {crntele}
                        </span>
                    ))
                }
            </div>

            <div className="flex justify-center mb-8">
                <Input
                    type="text"
                    placeholder="Search Recipe"
                    className="border-2 border-gray-300 rounded-lg px-2 py-3 mx-3 w-4/5 md:w-96 lg:w-96 shadow-sm"
                    value={inpVal}
                    onChange={(event) => setInpVal(event.target.value)}
                />
                <Button
                    variant="outline"
                    onClick={handleSearchBtn}
                    className="bg-orange_color text-white rounded-lg px-3 ml-2 mx-3 py-4"
                >
                    <CiSearch className="w-6 h-6" />
                </Button>
            </div>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-4 justify-center">

                        {loading ? (
                            <div className="loader"></div>
                        ) : errorState ? (
                            <p className="text-red-500">Error fetching recipe data</p>
                        ) : (
                            apiData.map((crntele, index) => (
                                <div className="p-4 sm:w-1/2 md:w-1/3 lg:w-1/4" key={index}>
                                    <Link target="_blank" href={crntele.recipe.url} passHref>
                                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                            <img
                                                className="lg:h-48 md:h-36 w-full object-cover object-center"
                                                src={crntele.recipe.image}
                                                alt={crntele.recipe.label}
                                            />
                                            <div className="p-6">
                                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                    {inpVal.toUpperCase()} RECIPE
                                                </h2>
                                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                    {crntele.recipe.label}
                                                </h1>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};
