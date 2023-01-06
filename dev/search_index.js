var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = VLBIImagePriors","category":"page"},{"location":"#VLBIImagePriors","page":"Home","title":"VLBIImagePriors","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for VLBIImagePriors.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [VLBIImagePriors]","category":"page"},{"location":"#VLBIImagePriors.ImageDirichlet","page":"Home","title":"VLBIImagePriors.ImageDirichlet","text":"ImageDirichlet(α::AbstractMatrix)\nImageDirichlet(α::Real, ny, nx)\n\nA Dirichlet distribution defined on a matrix. Samples from this produce matrices whose elements sum to unity. This is a useful image prior when you want to separately constrain the flux. The  α parameter defines the usual Dirichlet concentration amount.\n\nNotes\n\nMuch of this code was taken from Distributions.jl and it's Dirichlet distribution. However, some changes were made to make it faster. Additionally, we use define a custom rrule to speed up derivatives.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSimplex","page":"Home","title":"VLBIImagePriors.ImageSimplex","text":"ImageSimplex(ny,nx)\n\nThis defines a transformation from ℝⁿ⁻¹ to the n probability simplex defined on an matrix with dimension ny×nx. This is a more natural transformation for rasterized images, which are most naturally represented as a matrix.\n\nNotes\n\nMuch of this code was inspired by TransformVariables. However, we have specified custom rrules using Enzyme as a backend. This allowed the simplex transform to be used with Zygote and we achieved an order of magnitude speedup when computing the pullback of the simplex transform.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSphericalUniform","page":"Home","title":"VLBIImagePriors.ImageSphericalUniform","text":"ImageSphericalUniform(nx, ny)\n\nConstruct a distribution where each image pixel is a 3-sphere uniform variable. This is useful for polarization where the stokes parameters are parameterized on the 3-sphere.\n\nCurrently we use a struct of vectors memory layout. That is the image is described by three matrices (X,Y,Z) grouped together as a tuple, where each matrix is one direction on the sphere, and we require norm((X,Y,Z)) == 1.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageUniform","page":"Home","title":"VLBIImagePriors.ImageUniform","text":"ImageUniform(a::Real, b::Real, nx, ny)\n\nA uniform distribution in image pixels where a/b are the lower/upper bound for the interval. This then concatenates ny×nx uniform distributions together.\n\n\n\n\n\n","category":"type"}]
}
