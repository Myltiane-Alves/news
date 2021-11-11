import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';


const posts = [
    {
       slug: 'my-new-post',
       title: 'My New Post',
       excerpt: 'Post excerpt',
       updatedAt: '10 de Abril' 
    }
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts}  />)

        expect(screen.getByText("My New Post")).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                       uid: 'my-new-post',
                       data: {
                           title: [
                               { type: 'heading', text: 'My new post'}
                           ],
                           content: [
                               { type:'paragraph', text: 'Post excerpt' }
                           ],
                       },
                       last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

        const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: '<p>Post excerpt</p>',
                        updatedAt: '1 de Abril de 2021' 
                    }]
                }
            })
        )
    });
});
