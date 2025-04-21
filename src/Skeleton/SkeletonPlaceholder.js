import React from 'react';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonPlaceholder() {
    return (
        <div className="relative flex justify-center py-10 gap-10">
            {/* Левая панель - Criteria Skeleton */}
            <div className="w-[20%] max-w-[300px] min-w-[250px] space-y-4">
                {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="bg-white rounded-[20px] py-5 px-4 shadow-[5px_5px_5px_#d4d4d4]">
                        <Skeleton height={20} width={`60%`} className="mb-2 rounded"/>
                        <Skeleton count={3} height={15} className="rounded"/>
                    </div>
                ))}
            </div>

            <div className="w-[70%] max-w-[1000px] min-w-[600px] space-y-6">
                {[...Array(2)].map((_, idx) => (
                    <div className="bg-white rounded-[20px] mb-8 p-2.5 shadow-[10px_10px_10px_#d4d4d4]">
                        <div className="p-2.5">
                            <table className="w-full align-top">
                                <tbody>
                                <tr className="flex">
                                    {/* Иконки транспорта */}
                                    <td className="w-[30%] p-2.5 align-top">
                                        <div className="flex gap-2">
                                            <Skeleton width={40} height={40}/>
                                            <Skeleton width={40} height={40}/>
                                        </div>
                                    </td>

                                    {/* Отправление */}
                                    <td className="w-[10%] p-2.5 align-top">
                                        <div className="mb-1"><Skeleton width={50} height={14}/></div>
                                        <div className="mb-1"><Skeleton width={60} height={20}/></div>
                                        <div><Skeleton width={70} height={14}/></div>
                                    </td>

                                    {/* Длительность */}
                                    <td className="w-[15%] p-2.5 text-center">
                                        <Skeleton width={80} height={16}/>
                                    </td>

                                    {/* Прибытие */}
                                    <td className="w-[10%] p-2.5 align-top">
                                        <div className="mb-1"><Skeleton width={50} height={14}/></div>
                                        <div className="mb-1"><Skeleton width={60} height={20}/></div>
                                        <div><Skeleton width={70} height={14}/></div>
                                    </td>

                                    {/* Цена */}
                                    <td className="w-[35%] p-2.5 align-top">
                                        <div className="bg-gray-200 m-1 p-2 rounded-[5px] shadow-inner">
                                            <div className="flex justify-between items-center">
                                                <Skeleton width={80} height={16}/>
                                                <Skeleton width={70} height={20}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5">
                            <table className="w-full">
                                <tbody>
                                <tr className="flex">
                                    <td className="w-[30%] p-2.5 align-top">
                                        <Skeleton width={`70%`} height={20} className="mb-2"/>
                                        <Skeleton width={`90%`} height={14} className="mb-1"/>
                                        <Skeleton width={`80%`} height={14}/>
                                    </td>
                                    <td className="w-[10%] p-2.5 align-top">
                                        <Skeleton width={60} height={14} className="mb-1"/>
                                        <Skeleton width={50} height={20} className="mb-1"/>
                                        <Skeleton width={70} height={14}/>
                                    </td>
                                    <td className="w-[15%] p-2.5 text-center">
                                        <Skeleton width={80} height={16}/>
                                    </td>
                                    <td className="w-[10%] p-2.5 align-top">
                                        <Skeleton width={60} height={14} className="mb-1"/>
                                        <Skeleton width={50} height={20} className="mb-1"/>
                                        <Skeleton width={70} height={14}/>
                                    </td>
                                    <td className="w-[35%] p-2.5 align-top">
                                        <Skeleton height={40}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Блок пересадки */}
                        <div className="rounded-[10px] mb-2.5 p-1.5">
                            <table className="w-full">
                                <tbody>
                                <tr className="flex">
                                    <td className="w-[40%] p-2.5">
                                        <Skeleton width={`80%`} height={20}/>
                                    </td>
                                    <td className="w-[15%] p-2.5 text-center">
                                        <Skeleton width={60} height={16}/>
                                    </td>
                                    <td className="w-[45%] p-2.5">
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-[#e4e4e4] shadow-inner p-2.5 rounded-[10px] mb-2.5">
                            <table className="w-full">
                                <tbody>
                                <tr className="flex">
                                    <td className="w-[30%] p-2.5 align-top">
                                        <Skeleton width={`70%`} height={20} className="mb-2"/>
                                        <Skeleton width={`90%`} height={14} className="mb-1"/>
                                        <Skeleton width={`80%`} height={14}/>
                                    </td>
                                    <td className="w-[10%] p-2.5 align-top">
                                        <Skeleton width={60} height={14} className="mb-1"/>
                                        <Skeleton width={50} height={20} className="mb-1"/>
                                        <Skeleton width={70} height={14}/>
                                    </td>
                                    <td className="w-[15%] p-2.5 text-center">
                                        <Skeleton width={80} height={16}/>
                                    </td>
                                    <td className="w-[10%] p-2.5 align-top">
                                        <Skeleton width={60} height={14} className="mb-1"/>
                                        <Skeleton width={50} height={20} className="mb-1"/>
                                        <Skeleton width={70} height={14}/>
                                    </td>
                                    <td className="w-[35%] p-2.5 align-top">
                                        <Skeleton height={40}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonPlaceholder;