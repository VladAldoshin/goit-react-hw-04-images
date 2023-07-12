import { useState, useEffect } from 'react';
import { fetchPixabayImages } from '../Api/Api';
import { Searchbar } from '../Searchbar/Searchbar';
import { Loader } from '../Loader/Loader';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

  export const App = () => {
  const [inputRequest, setInputRequest] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    fetchImages(inputRequest, page);
  }, [inputRequest, page]);

  const fetchImages = async (query, page) => {
    setIsLoading(true);
    setError(null);
    if (!query) {
      setIsLoading(false);
      return;
    }
    try {
      const { hits, totalHits } = await fetchPixabayImages(query, page);
      const totalPages = Math.ceil(totalHits / perPage);
      const shouldLoadMore = page < totalPages;
      setImages((prevImages) => [...prevImages, ...hits]);
      setLoadMore(shouldLoadMore);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmit = (inputRequest) => {
    setInputRequest(inputRequest);
    setImages([]);
    setPage(1);
    setLoadMore(false);
  };

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (largeImageURL) => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Searchbar onSubmit={formSubmit} />
      {isLoading ? (
        <Loader />
      ) : (
        <ImageGallery images={images} openModal={openModal} />
      )}

      {loadMore && <Button onLoadMore={onLoadMore} page={page} />}

      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </>
  );
};















